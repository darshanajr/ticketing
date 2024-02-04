import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    userId: "123",
    title: "test",
    price: 20,
  });
  await ticket.save();

  const ticketFetchOne = await Ticket.findById(ticket.id);
  const ticketFetchTwo = await Ticket.findById(ticket.id);

  ticketFetchOne!.set({ price: 25 });
  ticketFetchTwo!.set({ price: 30 });

  await ticketFetchOne!.save();

  try {
    await ticketFetchTwo!.save();
  } catch (err) {
    return;
  }

  throw new Error("Test failed without throwing the expected exception");
});

it("increments the version number in each save", async () => {
  const ticket = Ticket.build({
    userId: "123",
    title: "test",
    price: 20,
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);

  const fetchedTicket = await Ticket.findById(ticket.id);
  fetchedTicket!.set({ price: 25 });
  await fetchedTicket!.save();
  expect(fetchedTicket!.version).toEqual(1);
});
